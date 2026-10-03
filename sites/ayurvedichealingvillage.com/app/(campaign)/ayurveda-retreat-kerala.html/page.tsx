import {SpecialistLanding} from '../_traffic/SpecialistLanding';
import {trafficMetadata} from '../_traffic/TrafficLanding';
import {content} from './content';
export const revalidate=3600;
export const metadata=trafficMetadata("ayurveda-retreat-kerala.html","Ayurveda Retreat in Kerala | Kairali","Authentic Ayurveda, surrounded by nature. Explore doctor-guided care, villas, meals, programme inclusions and planning at Kairali Ayurvedic Healing Village in Palakkad.");
export default function Page(){return <SpecialistLanding content={content} route="ayurveda-retreat-kerala.html" title="Ayurveda Retreat in Kerala" kind="retreat"/>;}
