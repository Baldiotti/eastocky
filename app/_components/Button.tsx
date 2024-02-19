"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Button() {
	const router = useRouter();
	const supabase = createClientComponentClient();
	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.replace("/login");
	};
	
	return (
		<div>
			<button className='button block' onClick={handleSignOut}>
				Sign out
			</button>
		</div>
	);
}
