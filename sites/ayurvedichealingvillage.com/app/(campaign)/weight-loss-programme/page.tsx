import {SpecialistLanding} from '../_traffic/SpecialistLanding';
import {trafficMetadata} from '../_traffic/metadata';
import {content} from './content';
export const revalidate=3600;
export const metadata=trafficMetadata("weight-loss-programme/","Ayurvedic Weight Management in Kerala | Kairali","A doctor-guided approach to weight and metabolism. Explore doctor-guided care, villas, meals, programme inclusions and planning at Kairali Ayurvedic Healing Village in Palakkad.");
export default function Page(){return <SpecialistLanding content={content} route="weight-loss-programme/" title="Ayurvedic Weight Management in Kerala" kind="weight"/>;}
