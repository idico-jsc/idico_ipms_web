import { toast } from "sonner";
import { FrappeError } from "frappe-react-sdk";
import parser from "html-react-parser";
import { useLanguage } from "@/hooks";
import { FrappeServerMessage } from "@/types";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/features/auth/store/auth-store";

export const useError = () => {
  const { t } = useTranslation("messages");
  const { currentLanguage } = useLanguage();
  const logout = useAuthStore((state) => state.logout);

  const errorCatcher = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (error: FrappeError | any) {
      const eMessages = getMessage(error);
      const messages = filterMessage(eMessages);
      showMessage(messages);
      return Promise.reject(error);
    }
  };

  const handleError = async (error: FrappeError) => {
    if (!error) return [];
    console.log("HANLE ERRROR", error);

    // Check status code
    if (error.exc_type === "PermissionError" || error.exc_type === "AuthenticationError") {
      // Handle unauthorized access
      await logout();
      window.location.href = "/login";
      return;
    }
    const eMessages = getMessage(error);
    const messages = filterMessage(eMessages);
    showMessage(messages);
    return messages;
  };

  const showMessage = (messages: FrappeServerMessage[]) => {
    toast.error(t("error.general.title"), {
      description: parser(`<ul>
          ${messages.map((msg) => {
            return `<li>${messages.length > 1 ? "•" : ""} ${msg.message}</li>`;
          })}
        </ul>`),
    });
  };

  const filterMessage = (messages: FrappeServerMessage[]) => {
    return messages.reduce<FrappeServerMessage[]>((msgs, msg) => {
      if (!msg.message.includes("|")) {
        msgs.push({
          title: t("error.general.title"),
          message: `${t("error.general.message")} <br/> Detail: ${msg.message}`,
        });
      } else {
        const lngs = msg.message.split("|");
        msgs.push(currentLanguage === "en" ? { message: lngs[1] } : { message: lngs[0] });
      }
      return msgs;
    }, []);
  };

  const getMessage = (error?: FrappeError) => {
    let eMessages: FrappeServerMessage[] = error?._server_messages
      ? JSON.parse(error?._server_messages)
      : [];
    eMessages = eMessages.map((m: any) => {
      try {
        return JSON.parse(m);
      } catch (e) {
        return m;
      }
    });

    // Get the message from the exception by removing the exc_type
    const indexOfFirstColon = error?.exception?.indexOf(":");
    if (indexOfFirstColon) {
      const exception = error?.exception?.slice(indexOfFirstColon + 1);
      if (exception) {
        eMessages = [
          {
            message: exception,
            title: "Error",
          },
        ];
      }
    }

    if (eMessages.length === 0) {
      eMessages = [
        {
          message: error?.message || t("error.general.message"),
          title: "Error",
          indicator: "red",
        },
      ];
    }

    return eMessages;
  };

  return { errorCatcher, handleError, getMessage };
};
