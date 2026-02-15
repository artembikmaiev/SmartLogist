// Головна сторінка панелі адміністратора з оглядом загальної статистики системи та активності.
import { redirect } from 'next/navigation';
import { Shield, Users, Truck, AlertCircle } from "lucide-react";

export default function AdminHomePage() {
    redirect('/admin/managers');
}
