'use client'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios from 'axios'

const formSchema = z.object({
	email: z.string().email().min(2).max(50),
})

export default function ForgetPasswordPage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const email = values.email
		try {
			const res = await axios.post('/api/forget-password', {
				email,
			})
			if (res.status === 200) {
				toast.success(res.data.message || 'Email sent Successfully!')
			} else {
				toast.error('Something went wrong. Please try again.')
			}
		} catch (error) {
			console.log(error)
			toast.error('Something went wrong. Please try again.')
		}
	}

	return (
		<MaxWidthWrapper className="flex-1">
			<h1 className="text-center text-3xl font-bold">Forgot Password</h1>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="user@gmail.com" {...field} />
								</FormControl>
								<FormDescription>Enter your email address and we will send you a link to reset your password.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</MaxWidthWrapper>
	)
}
