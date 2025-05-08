'use client'
import type React from 'react'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExternalLink, Mail, Building, Users } from 'lucide-react'
import { Sponsors } from '@prisma/client'

export default function SponsorsComp({ allSponsors }: { allSponsors: Sponsors[] }) {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		company: '',
		sponsorshipType: '',
		message: '',
	})

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		// Simulate form submission
		setTimeout(() => {
			setIsSubmitting(false)
			setIsSubmitted(true)
		}, 1500)
	}

	const sponsors = [
		{
			name: 'PowerEnergy',
			logo: 'https://picsum.photos/200/300',
			description: 'Energy drink brand fueling gamers worldwide with performance-enhancing beverages.',
			website: 'https://example.com/powerenergy',
		},
		{
			name: 'GearPro',
			logo: 'https://picsum.photos/200/300',
			description: 'Professional gaming peripherals designed for competitive players.',
			website: 'https://example.com/gearpro',
		},
		{
			name: 'NetSpeed',
			logo: 'https://picsum.photos/200/300',
			description: 'High-speed internet provider optimized for gaming and streaming.',
			website: 'https://example.com/netspeed',
		},
	]

	if (isSubmitted) {
		return (
			<div className="container mx-auto py-12 md:py-16 lg:py-20 flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center text-green-600">Thank You!</CardTitle>
						<CardDescription className="text-center">Your sponsorship inquiry has been submitted.</CardDescription>
					</CardHeader>
					<CardContent className="text-center">
						<p className="mb-4">
							We appreciate your interest in sponsoring our gaming community. A member of our team will review your information and
							contact you shortly.
						</p>
					</CardContent>
					<CardFooter className="flex justify-center">
						<Link href="/sponsors">
							<Button variant="outline">Back to Sponsors</Button>
						</Link>
					</CardFooter>
				</Card>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-12 px-4 sm:px-0 md:py-16 lg:py-20">
			<div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Sponsors</h1>
					<p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						We&apos;re proud to partner with these amazing companies who support our gaming community.
					</p>
				</div>
			</div>

			<Tabs defaultValue="sponsors" className="w-full mb-12">
				<TabsList className="grid w-full grid-cols-2 mb-8">
					<TabsTrigger value="sponsors">Current Sponsors</TabsTrigger>
					<TabsTrigger value="contact">Become a Sponsor</TabsTrigger>
				</TabsList>

				<TabsContent value="sponsors">
					<div className="space-y-12 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
						{allSponsors.map(company => (
							<Card key={company.id} className="overflow-hidden max-h-96 h-full">
								<div className="p-6 flex justify-center items-center bg-gray-800 border-b border-gray-700">
									<Image
										src={company.logo || 'https://picsum.photos/200/300'}
										alt={company.companyName}
										width={200}
										height={100}
										className="object-cover h-32"
									/>
								</div>
								<CardContent className="p-6">
									<h3 className="font-bold text-lg mb-2">{company.companyName}</h3>
									<p className="text-sm text-gray-400 mb-4">{company.description}</p>
									{company.website && (
										<Link
											href={company.website}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800">
											<ExternalLink className="h-4 w-4 mr-1" />
											Visit Website
										</Link>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="contact" id="contact-form">
					<div className="grid gap-8 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Contact Us</CardTitle>
								<CardDescription>Interested in sponsoring our gaming community? Fill out the form to get started.</CardDescription>
							</CardHeader>
							<form onSubmit={handleSubmit}>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="name">Your Name</Label>
										<Input
											id="name"
											name="name"
											placeholder="Enter your name"
											value={formData.name}
											onChange={handleChange}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="email">Email Address</Label>
										<Input
											id="email"
											name="email"
											type="email"
											placeholder="Enter your email"
											value={formData.email}
											onChange={handleChange}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="company">Company Name</Label>
										<Input
											id="company"
											name="company"
											placeholder="Enter your company name"
											value={formData.company}
											onChange={handleChange}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="message">Message</Label>
										<Textarea
											id="message"
											name="message"
											placeholder="Tell us about your company and sponsorship goals"
											value={formData.message}
											onChange={handleChange}
											required
											className="min-h-[120px]"
										/>
									</div>
								</CardContent>
								<CardFooter className="mt-4">
									<Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={isSubmitting}>
										{isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
									</Button>
								</CardFooter>
							</form>
						</Card>

						<div className="space-y-6">
							<div className="space-y-2">
								<h3 className="text-xl font-bold">Why Sponsor Us?</h3>
								<p className="text-gray-400">
									Partnering with our gaming community offers unique opportunities to connect with engaged gamers and esports
									enthusiasts.
								</p>
								<ul className="space-y-2 mt-4">
									<li className="flex items-start">
										<Users className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
										<div>
											<span className="font-medium">Growing Community</span>
											<p className="text-sm text-gray-400">Access to our rapidly expanding community of over 10,000 active gamers.</p>
										</div>
									</li>
									<li className="flex items-start">
										<Building className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
										<div>
											<span className="font-medium">Brand Exposure</span>
											<p className="text-sm text-gray-400">Showcase your brand to a targeted audience of gaming enthusiasts.</p>
										</div>
									</li>
									<li className="flex items-start">
										<Mail className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
										<div>
											<span className="font-medium">Direct Engagement</span>
											<p className="text-sm text-gray-400">Opportunities for direct product feedback and community engagement.</p>
										</div>
									</li>
								</ul>
							</div>

							<div className="p-6 bg-purple-900 rounded-lg">
								<h3 className="text-lg font-medium mb-2">Contact Information</h3>
								<p className="text-sm text-gray-400 mb-4">
									If you prefer to reach out directly, you can contact our sponsorship team:
								</p>
								<div className="space-y-2 text-sm">
									<p>
										<span className="font-medium">Email:</span> sponsors@HeistGames.com
									</p>
									<p>
										<span className="font-medium">Phone:</span> (555) 123-4567
									</p>
									<p>
										<span className="font-medium">Contact:</span> Jane Smith, Sponsorship Manager
									</p>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
