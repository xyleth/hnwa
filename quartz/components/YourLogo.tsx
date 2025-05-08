// In quartz/components/YourLogo.tsx
import { QuartzComponentConstructor } from "./types"

const YourLogo: QuartzComponentConstructor = (opts?: undefined) => {
  return () => (
    <div className="your-logo">
      <a href="/">
        {/* For image logo */}
        <img src="/static/logo.png" alt="HNWA Logo" />
        <span className="logo-text">Holywell Neighbourhood Watch Association</span>
        {/* Or for text logo */}
        {/* <span className="logo-text">HNWA Notes</span> */}
      </a>
    </div>
  )
}

export default YourLogo