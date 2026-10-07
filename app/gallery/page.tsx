import Image from "next/image";
import Link from "next/link";
import profile from "../data/profile.json";
import { Footer } from "../components/ui";

export const metadata = { title: "Thura Nyi | Gallery" };

export default function GalleryPage() {
  return <div className="profile-extras gallery-page section"><h1>Life beyond the code</h1><p><Link href="/about">&larr; About me</Link></p><div className="certificate-grid">{profile.archive.map(photo => <figure key={photo.image.src}><Image src={photo.image.src} alt={photo.alt} width={photo.image.width} height={photo.image.height} sizes="(max-width: 696px) 90vw, 40vw" /><figcaption>{photo.caption}</figcaption></figure>)}</div><Footer /></div>;
}
