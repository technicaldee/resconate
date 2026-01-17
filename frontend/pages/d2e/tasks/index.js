import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TasksRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/d2e');
    }, [router]);
    return null;
}
