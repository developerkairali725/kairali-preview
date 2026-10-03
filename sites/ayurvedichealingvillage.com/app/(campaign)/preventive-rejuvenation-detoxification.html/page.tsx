import {SpecialistLanding} from '../_traffic/SpecialistLanding';
import {trafficMetadata} from '../_traffic/metadata';
import {content} from './content';
export const revalidate=3600;
export const metadata=trafficMetadata("preventive-rejuvenation-detoxification.html","Ayurvedic Rejuvenation & Detoxification in Kerala | Kairali","Make time for rest, renewal and personalised care. Explore doctor-guided care, villas, meals, programme inclusions and planning at Kairali Ayurvedic Healing Village in Palakkad.");
export default function Page(){return <SpecialistLanding content={content} route="preventive-rejuvenation-detoxification.html" title="Ayurvedic Rejuvenation & Detoxification in Kerala" kind="detox"/>;}
