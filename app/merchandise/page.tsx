import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'

export default function MerchandisePage() {
	const categories = [{ id: 'apparel', name: 'Apparel' }]

	const products = [
		{
			id: 1,
			name: 'HeistGames Logo T-Shirt',
			price: 24.99,
			image: 'https://picsum.photos/200/300',
			description: 'Classic cotton t-shirt with the HeistGames logo.',
			colors: ['Black', 'White', 'Gray'],
			sizes: ['S', 'M', 'L', 'XL', 'XXL'],
		},
		{
			id: 2,
			name: 'Tournament Champion Hoodie',
			price: 49.99,
			image: 'https://picsum.photos/200/300',
			description: 'Premium hoodie with embroidered championship design.',
			colors: ['Black', 'Navy'],
			sizes: ['S', 'M', 'L', 'XL', 'XXL'],
		},
		{
			id: 3,
			name: 'Esports Jersey',
			price: 59.99,
			image: 'https://picsum.photos/200/300',
			description: 'Official team jersey with custom gamertag option.',
			colors: ['Team Colors'],
			sizes: ['S', 'M', 'L', 'XL', 'XXL'],
		},
		{
			id: 4,
			name: 'Gaming Snapback Cap',
			price: 29.99,
			image: 'https://picsum.photos/200/300',
			description: 'Adjustable snapback cap with embroidered logo.',
			colors: ['Black', 'Gray'],
			sizes: ['One Size'],
		},
	]

	return (
		<div className="container mx-auto px-4 sm:px-0 py-12 md:py-16 lg:py-20">
			<div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Merchandise</h1>
					<p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						Show your support with official HeistGames merchandise.
					</p>
				</div>
			</div>

			{categories.map(category => (
				<div key={category.id}>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{products.map(product => (
							<Card key={product.id} className="overflow-hidden">
								<div className="aspect-square relative">
									<Image
										src={product.image || 'https://picsum.photos/200/300'}
										alt={product.name}
										fill
										className="object-cover transition-transform hover:scale-105"
									/>
								</div>
								<CardContent className="p-4">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-medium">{product.name}</h3>
											<p className="text-sm text-gray-400 mt-1">{product.description}</p>
										</div>
										<div className="text-lg font-bold">${product.price}</div>
									</div>
									<div className="mt-3 text-sm">
										<div className="flex items-center gap-2">
											<span className="font-medium">Colors:</span>
											<span className="text-gray-400">{product.colors.join(', ')}</span>
										</div>
										<div className="flex items-center gap-2 mt-1">
											<span className="font-medium">Sizes:</span>
											<span className="text-gray-400">{product.sizes.join(', ')}</span>
										</div>
									</div>
								</CardContent>
								<CardFooter className="p-4 pt-0">
									<Link href={`/merchandise/${product.id}`} className="w-full">
										<Button className="w-full bg-purple-700 hover:bg-purple-800">
											<ShoppingCart className="mr-2 h-4 w-4" />
											Add to Cart
										</Button>
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
