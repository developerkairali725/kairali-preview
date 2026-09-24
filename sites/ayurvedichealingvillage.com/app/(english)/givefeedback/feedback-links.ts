export const MANAGEMENT_EMAIL='info@kairali.com';
export const PATIENT_CARE_NUMBER='919289838797';
export const TOPICS=['General feedback','Appreciation','A suggestion','A concern','Request a management response'] as const;
export type FeedbackDraft={name:string;stay:string;topic:string;message:string};
export function feedbackLinks(draft:FeedbackDraft){
 const topic=TOPICS.find(t=>t===draft.topic)||TOPICS[0];
 const subject=`For management: ${topic} — Kairali Healing Village`;
 const details=[draft.name.trim()&&`Name: ${draft.name.trim()}`,draft.stay.trim()&&`Stay dates / booking reference: ${draft.stay.trim()}`].filter(Boolean).join('\n');
 const content=[details,`Feedback: ${draft.message.trim()}`].filter(Boolean).join('\n\n');
 const emailBody=`Dear Kairali management,\n\n${content}\n\nPlease reply to this email.\n\nThank you.`;
 const whatsappBody=`Hi Priya, I would like to share feedback about Kairali — The Ayurvedic Healing Village. Please pass this to the management team.\n\nTopic: ${topic}\n\n${content}`;
 return {subject,emailBody,whatsappBody,email:`mailto:${MANAGEMENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`,whatsapp:`https://wa.me/${PATIENT_CARE_NUMBER}?text=${encodeURIComponent(whatsappBody)}`};
}
export const QUICK_LINKS=feedbackLinks({name:'',stay:'',topic:'Request a management response',message:'I would like to share my experience and hear from the management team.\n\nMy stay dates / booking reference:\n\nWhat I would like you to know:\n\nHow you can help:'});
