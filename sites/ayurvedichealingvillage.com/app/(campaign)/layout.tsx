import type { ReactNode } from "react";
import type { Metadata } from "next";
import CampaignDocument from "../../campaign-v110/CampaignDocument";
export const metadata:Metadata={robots:{index:process.env.AHV_STAGING === "0" && true,follow:true}};
export default function Layout({children}:{children:ReactNode}){return <CampaignDocument lang="en">{children}</CampaignDocument>;}
