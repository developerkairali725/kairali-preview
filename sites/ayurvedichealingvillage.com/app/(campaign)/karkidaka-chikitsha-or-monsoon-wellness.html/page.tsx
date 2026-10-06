import './monsoon.css';
import {SpecialistLanding} from '../_traffic/SpecialistLanding';
import {trafficMetadata} from '../_traffic/metadata';
import {content} from './content';
export const revalidate=3600;
export const metadata=trafficMetadata("karkidaka-chikitsha-or-monsoon-wellness.html","Monsoon Ayurvedic Treatment in Kerala | Kairali","Karkidaka Chikitsa \u00b7 Plan your July\u2013August retreat. Explore doctor-guided care, villas, meals, programme inclusions and planning at Kairali Ayurvedic Healing Village in Palakkad.");
export default function Page(){return <SpecialistLanding content={content} route="karkidaka-chikitsha-or-monsoon-wellness.html" title="Monsoon Ayurvedic Treatment in Kerala" kind="monsoon"/>;}
