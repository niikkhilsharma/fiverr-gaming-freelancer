import prisma from '@/lib/prisma/prisma'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function SponsorsInquiryPage() {
	const sponsorsInquiry = await prisma.becomeSponsor.findMany()

	return (
		<div className="container mx-auto flex min-h-screen flex-col py-10 px-4">
			<h1 className="text-3xl font-bold mb-2 text-center">Sponsors Inquiry</h1>
			<p className="text-gray-500 dark:text-gray-400 text-center mb-6">
				Here are all the sponsors who have submitted inquiries.
			</p>

			{sponsorsInquiry.length > 0 ?
				<div className="overflow-x-auto">
					<Table>
						<TableCaption>A list of all propler sponsors</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Company Name</TableHead>
								<TableHead className="text-right">Message</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sponsorsInquiry.map(sponsor => (
								<TableRow key={sponsor.id}>
									<TableCell>{sponsor.name}</TableCell>
									<TableCell>{sponsor.email}</TableCell>
									<TableCell>{sponsor.companyName}</TableCell>
									<TableCell className="text-right">{sponsor.message}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			:	<div className="text-center text-gray-500 dark:text-gray-400">
					<p>No sponsors inquiries found.</p>
					<p>It seems like no one has submitted an inquiry yet.</p>
				</div>
			}
		</div>
	)
}
