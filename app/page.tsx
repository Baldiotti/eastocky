import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountForm from "./account/account-form";

export default async function Home() {
	const supabase = createServerComponentClient({ cookies });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		console.log(user);
		redirect("/login");
	}

	return <AccountForm user={user} />;
}
