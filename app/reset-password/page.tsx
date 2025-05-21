'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios from 'axios'

const formSchema = z.object({
	newPassword: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function ResetPasswordPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			newPassword: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const res = await axios.post('/api/reset-password', {
				token,
				newPassword: values.newPassword,
			})

			if (res.status === 200) {
				toast.success('Password reset successful! You can now log in.')
				router.push('/login')
			}
		} catch (error) {
			console.error(error)
			toast.error('Something went wrong. Please try again.')
		}
	}

	if (!token) {
		return <p className="text-center text-red-500 mt-10">Invalid or missing token.</p>
	}

	return (
		<MaxWidthWrapper className="flex-1">
			<h1 className="text-center text-3xl font-bold">Reset Your Password</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8 max-w-md mx-auto">
					<FormField
						control={form.control}
						name="newPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="••••••••" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full">
						Reset Password
					</Button>
				</form>
			</Form>
		</MaxWidthWrapper>
	)
}
