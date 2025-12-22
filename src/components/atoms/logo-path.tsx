import { HTMLAttributes,type FC } from 'react'
import { cn } from '@/utils'

export type LogoPathProps = HTMLAttributes<HTMLDivElement> & {}

export const LogoPath: FC<LogoPathProps> = ({ className }) => {
  return <div className={cn("",className)} style={{
    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 2.5vw), 62% 100%, 0 calc(68% - 0.5vw))"

  }}>

  </div>
}
