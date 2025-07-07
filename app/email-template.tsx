import * as React from 'react'

interface EmailTemplateProps {
	firstName: string
	link: string
}

export const ForgotPasswordEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = async ({ firstName, link }) => {
	console.log(firstName, link, 'from client side')
	return (
		<div>
			<h1>Welcome, {firstName}!</h1>
			<p>Please click the link below to verify your email address.</p>
			<p>
				<a href={link} target="_blank">
					Verify Email
				</a>
			</p>
		</div>
	)
}
