import './benefits.css';
import {SpecialistLanding} from '../_traffic/SpecialistLanding';
import {trafficMetadata} from '../_traffic/metadata';
import {content} from './content';
export const revalidate=3600;
export const metadata=trafficMetadata("digestive-wellness-gut-health-yoga-therapy/","Digestive Wellness & Gut Health Yoga Therapy | Kairali","Personalised Ayurveda, therapeutic yoga and mindful meals. Explore doctor-guided care, villas, meals, programme inclusions and planning at Kairali Ayurvedic Healing Village in Palakkad.");
export default function Page(){return <SpecialistLanding content={content} route="digestive-wellness-gut-health-yoga-therapy/" title="Digestive Wellness & Gut Health Yoga Therapy" kind="digestive"/>;}
