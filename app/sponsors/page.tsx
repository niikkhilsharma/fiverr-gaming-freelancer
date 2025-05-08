import prisma from '@/lib/prisma/prisma'
import SponsorsComp from './sponsor'

export default async function SponsorsPage() {
	const allSponsors = await prisma.sponsors.findMany()

	return <SponsorsComp allSponsors={allSponsors} />
}
