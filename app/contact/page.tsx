import type { Metadata } from "next";
import { Decoder, Footer, Icon } from "../components/ui";
import "../pages.css";

export const metadata: Metadata = { title: "Thura Nyi | Contact", description: "Get in touch." };

export default function ContactPage() {
  return <div className="contact-page section">
    <h1><Decoder text="Let’s build something together." /></h1>
    <p><Decoder text="Get in touch: thuranyi64@gmail.com" /></p>
    <a className="primary-button contact-email" href="mailto:thuranyi64@gmail.com"><Icon name="send" />Send email</a>
    <Footer />
  </div>;
}
