import { TrafficLanding, trafficMetadata } from '../_traffic/TrafficLanding';
import {content} from './content';
export const revalidate=3600;
export const metadata=trafficMetadata("pain-management.html","Ayurvedic Pain Management in Kerala | Kairali","Explore a doctor-guided Ayurvedic pain management programme in Palakkad, Kerala, with personalised therapies, lifestyle guidance and a peaceful residential setting.");
export default function Page(){return <TrafficLanding content={content} kind="pain"/>;}
