import { TrafficLanding, trafficMetadata } from '../_traffic/TrafficLanding';
import {content} from './content';
export const revalidate=3600;
export const metadata=trafficMetadata("family-ayurvedic-retreat-kerala.html","Family Ayurveda Retreat in Kerala | Kairali","Plan a family Ayurveda retreat in Palakkad, Kerala, with individual doctor-guided programmes, villas, vegetarian meals, yoga and time together.");
export default function Page(){return <TrafficLanding content={content} kind="family"/>;}
