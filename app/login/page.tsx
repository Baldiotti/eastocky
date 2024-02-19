import Login from "../_components/Login";

export default function Home() {
	return (
		<div className='row'>
			<div className='col-6 auth-widget'>
				<h1 className='header'>Supabase Auth + Storage</h1>
				<Login />
			</div>
		</div>
	);
}