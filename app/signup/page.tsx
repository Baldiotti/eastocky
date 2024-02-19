"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from 'next/navigation'
import { useState } from 'react'


export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
	const router = useRouter();
	const supabase = createClientComponentClient();

	supabase.auth.onAuthStateChange(async (event) => {
		if (event === "SIGNED_IN") {
			router.refresh();
		}
	});

  const handleSignUp = async () => {
    await supabase.auth.signUp(
			{
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
      // options: {
      //   emailRedirectTo: `${location.origin}/auth/callback`,
      // },
    })
    router.refresh()
  }


  return (
    <>
      <input name="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <input
        type="password"
        name="password"
				placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <input
        type="name"
        name="name"
				placeholder="name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <button onClick={handleSignUp}>Sign up</button>
    </>
  )
}
