'use client'
import { useState, useCallback } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Camera, Loader2 } from 'lucide-react'
import axios from 'axios'

// Helper function to create a cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image()
		image.addEventListener('load', () => resolve(image))
		image.addEventListener('error', error => reject(error))
		image.src = url
	})

import MaxWidthWrapper from '@/components/max-width-wrapper'
import { Calendar } from '@/components/ui/custom-calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

// Define form schema
// Function to get cropped image canvas
function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
	return new Promise(async (resolve, reject) => {
		try {
			const image = await createImage(imageSrc)
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')

			if (!ctx) {
				reject(new Error('Could not get canvas context'))
				return
			}

			// Set canvas size to the cropped size
			canvas.width = pixelCrop.width
			canvas.height = pixelCrop.height

			// Draw the cropped image onto the canvas
			ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height)

			// Get the data URL from canvas as png format
			canvas.toBlob(
				blob => {
					if (blob) {
						resolve(blob)
					} else {
						reject(new Error('Canvas toBlob failed'))
					}
				},
				'image/jpeg',
				0.95
			)
		} catch (error) {
			reject(error)
		}
	})
}

// Define form schema and its inferred type
const formSchema = z.object({
	name: z.string().min(2, { message: 'Tournament name must be at least 2 characters' }),
	description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
	startDate: z.date({ required_error: 'Start date is required' }),
	startTime: z.string().min(1, { message: 'Start time is required' }),
	endDate: z.date({ required_error: 'End date is required' }),
	endTime: z.string().min(1, { message: 'End time is required' }),
	prizePool: z.string().min(1, { message: 'Prize pool is required' }),
	maxPlayers: z.string().min(1, { message: 'Max players is required' }).optional(),
	streamingUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
	image: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateTournamentPage() {
	const [loading, setLoading] = useState(false)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
	const [zoom, setZoom] = useState<number>(1)
	const [originalFile, setOriginalFile] = useState<File | null>(null)

	const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixelsData: Area) => {
		setCroppedAreaPixels(croppedAreaPixelsData)
	}, [])

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: '',
			startTime: '',
			endTime: '',
			prizePool: '',
			maxPlayers: '',
			streamingUrl: '',
			image: null,
		},
	})

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setOriginalFile(file)

			// Don't set the form value yet, wait until cropping is done
			// Create image preview for cropper
			const reader = new FileReader()
			reader.onload = () => {
				setImagePreview(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const onSubmit = async (values: FormValues) => {
		// If we have a cropped image area, process it before submission
		setLoading(true)
		if (imagePreview && croppedAreaPixels) {
			try {
				const croppedImageBlob = await getCroppedImg(imagePreview, croppedAreaPixels)

				// Create a new file from the blob with the original filename
				const fileName = originalFile?.name || 'cropped-image.jpg'
				const croppedFile = new File([croppedImageBlob], fileName, {
					type: 'image/jpeg',
					lastModified: new Date().getTime(),
				})

				// Replace the original image with the cropped one
				values.image = croppedFile
			} catch (error) {
				console.error('Error cropping image:', error)
			}
		}

		console.log('Form submitted:', values)

		try {
			const formData = new FormData()
			Object.entries(values).forEach(([key, value]) => {
				if (key === 'startDate' || key === 'endDate') {
					formData.append(key, value.toISOString())
				} else if (key === 'image') {
					formData.append(key, value)
				} else if (value !== undefined && value !== null) {
					formData.append(key, String(value))
				}
			})
			const request = await axios.post('/api/admin/create-tournament', formData)
			const data = request.data
			console.log(data)
		} catch (error) {
			console.error('Error setting up the request:', error)
		}
		setLoading(false)
	}

	return (
		<MaxWidthWrapper className="min-h-screen py-12">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Create Tournament</h1>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Tournament Name */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tournament Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter tournament name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Tournament Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea placeholder="Enter tournament description" className="resize-none" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Start Date and Time */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Start Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
														{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													captionLayout="dropdown-buttons"
													selected={field.value}
													onSelect={field.onChange}
													fromYear={new Date().getFullYear()}
													toYear={new Date().getFullYear() + 10}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="startTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Time</FormLabel>
										<FormControl>
											<div className="flex items-center">
												<Input type="time" placeholder="Select time" {...field} />
												<Clock className="ml-2 h-4 w-4 opacity-50" />
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* End Date and Time */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>End Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
														{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													captionLayout="dropdown-buttons"
													selected={field.value}
													onSelect={field.onChange}
													fromYear={new Date().getFullYear()}
													toYear={new Date().getFullYear() + 10}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="endTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>End Time</FormLabel>
										<FormControl>
											<div className="flex items-center">
												<Input type="time" placeholder="Select time" {...field} />
												<Clock className="ml-2 h-4 w-4 opacity-50" />
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Prize Pool and Max Players */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="prizePool"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Prize Pool</FormLabel>
										<FormControl>
											<div className="relative">
												<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
												<Input type="number" min="0" step="0.01" className="pl-8" placeholder="0.00" {...field} />
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="maxPlayers"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Max Players</FormLabel>
										<FormControl>
											<Input type="number" min="2" placeholder="Enter maximum players" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Streaming URL */}
						<FormField
							control={form.control}
							name="streamingUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Streaming URL</FormLabel>
									<FormControl>
										<Input placeholder="https://discord.gg/..." {...field} />
									</FormControl>
									<FormDescription>Optional: Add a url where the tournament will be streamed</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Tournament Image */}
						<FormField
							control={form.control}
							name="image"
							render={({ field: { onChange, ...fieldProps } }) => (
								<FormItem>
									<FormLabel>Tournament Image</FormLabel>
									<FormControl>
										<Card className="border-dashed relative">
											<CardContent className="flex flex-col items-center justify-center p-6">
												{imagePreview ? (
													<div className="relative w-full">
														<div className="h-64 relative">
															<Cropper
																image={imagePreview}
																crop={crop}
																zoom={zoom}
																aspect={4 / 3}
																onCropChange={setCrop}
																onCropComplete={onCropComplete}
																onZoomChange={setZoom}
															/>
														</div>
														<div className="mt-4">
															<p className="text-sm mb-1">Zoom: {zoom.toFixed(1)}x</p>
															<Slider
																value={[zoom]}
																min={1}
																max={3}
																step={0.1}
																className="w-full"
																onValueChange={value => setZoom(value[0])}
															/>
														</div>
														<Button
															type="button"
															variant="ghost"
															size="sm"
															className="mt-4"
															onClick={() => {
																setImagePreview(null)
																setOriginalFile(null)
																onChange(null)
																setZoom(1)
																setCrop({ x: 0, y: 0 })
																setCroppedAreaPixels(null)
															}}>
															Remove Image
														</Button>
													</div>
												) : (
													<>
														<Camera className="h-12 w-12 text-gray-400 mb-4" />
														<div className="flex flex-col items-center text-sm text-gray-600">
															<label
																htmlFor="image-upload"
																className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
																<span>Upload an image</span>
																<input
																	id="image-upload"
																	type="file"
																	accept="image/*"
																	className="sr-only"
																	onChange={e => handleImageChange(e)}
																	{...fieldProps}
																/>
															</label>
															<p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
														</div>
													</>
												)}
											</CardContent>
										</Card>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Submit Button */}
						<div className="flex justify-end">
							<Button type="submit" disabled={loading}>
								Create Tournament {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</MaxWidthWrapper>
	)
}
