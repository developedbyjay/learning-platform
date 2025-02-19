<script lang="ts">
	import type { PageData } from './$types';
	import * as Alert from '$lib/components/ui/alert';
	import IconBadge from '$lib/components/IconBadge.svelte';
	import TitleForm from '$lib/components/TitleForm.svelte';
	import DescriptionForm from '$lib/components/DescriptionForm.svelte';
	import ImageForm from '$lib/components/ImageForm.svelte';
	import CategoryForm from '$lib/components/CategoryForm.svelte';
	import PriceForm from '$lib/components/PriceForm.svelte';
	import AttachmentForm from '$lib/components/AttachmentForm.svelte';
	import ChapterForm from '$lib/components/ChapterForm.svelte';

	import {
		AlertTriangle,
		CircleDollarSign,
		File,
		LayoutDashboard,
		ListChecks
	} from 'lucide-svelte';
	// c72dr2k8m7lv29j
	export let data: PageData;

	$: course = data.course;

	$: requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.category,
		course.expand?.['chapters(course)']?.some((chapter) => chapter.isPublished)
	];

	$: totalFields = requiredFields.length;
	$: completedFields = requiredFields.filter(Boolean).length;

	$: completedText = `(${completedFields}/${totalFields})`;
	$: isComplete = requiredFields.every(Boolean);
</script>

{#if !course.isPublished}
	<Alert.Root class="rounded-none border border-yellow-300 bg-yellow-200/80">
		<AlertTriangle class="size-4" />
		<Alert.Title>Heads up!</Alert.Title>
		<Alert.Description
			>This course is un-published. it will not be visible to student</Alert.Description
		>
	</Alert.Root>
{/if}

<div class="p-6">
	<div class="flex items-center justify-between">
		<div class="flex flex-col gap-y-2">
			<h1 class="text-2xl font-medium">Course Setup</h1>
			<span class="text-sm text-muted-foreground">
				complete all fields: {completedText}
			</span>
		</div>
		<!-- Actions -->
	</div>

	<div class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
		<div class="">
			<div class="flex items-center gap-x-2">
				<IconBadge icon={LayoutDashboard} />
				<h2 class="text-xl">Customize your course</h2>
			</div>

			<TitleForm data={data.titleForm} />
			<DescriptionForm data={data.descriptionForm} />
			<ImageForm imageUrl={course.imageUrl} />
			<CategoryForm data={data.categoryForm} categories={data.categories} />
		</div>
		<div class="space-y-6">
			<div class="">
				<div class="flex items-center gap-x-2">
					<IconBadge icon={ListChecks} />
					<h2 class="text-xl">Course chapters</h2>
				</div>
				<ChapterForm data={data.chapterTitleForm} chapters={course.expand?.['chapters(course)'] ?? []} />
				 
			</div>
			<div class="">
				<div class=" flex items-center gap-x-2">
					<IconBadge icon={CircleDollarSign} />
					<h2 class="text-xl">Sell your course</h2>
				</div>
				<PriceForm data={data.priceForm} />
			</div>
			<div class="">
				<div class=" flex items-center gap-x-2">
					<IconBadge icon={File} />
					<h2 class="text-xl">Resources & attachment</h2>
				</div>
				<AttachmentForm attachments={data.attachments ?? []} />
			</div>
		</div>
	</div>
</div>
