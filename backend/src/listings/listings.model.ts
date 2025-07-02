export enum ListingStatus {
	DRAFT = 'DRAFT',
	READY = 'READY',
	PUBLISHED = 'PUBLISHED',
	ARCHIVED = 'ARCHIVED'
}

export enum ListingCondition {
	NEW = 'NEW',
	LIKE_NEW = 'LIKE_NEW',
	GOOD = 'GOOD',
	FAIR = 'FAIR',
	POOR = 'POOR'
}

export class Listing {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public status: ListingStatus,
		public imageKeys: string[],
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
		// User-entered info
		public size?: string | null,
		public condition?: string | null,
		public material?: string | null,
		public gender?: string | null,
		public brand?: string | null,
		public measurements?: any | null, // Json type
		public originalPrice?: number | null,
		// AI generated
		public title?: string | null,
		public description?: string | null,
		public tags: string[] = [],
		public category?: string | null,
		public subcategory?: string | null,
		public color?: string | null,
		public price?: number | null
	) {}

	// Domain methods
	publish(): void {
		if (this.status !== ListingStatus.READY) {
			throw new Error('Only ready listings can be published');
		}
		this.status = ListingStatus.PUBLISHED;
	}

	markReady(): void {
		if (this.status !== ListingStatus.DRAFT) {
			throw new Error('Only draft listings can be marked ready');
		}
		this.status = ListingStatus.READY;
	}

	archive(): void {
		if (this.status !== ListingStatus.PUBLISHED) {
			throw new Error('Only published listings can be archived');
		}
		this.status = ListingStatus.ARCHIVED;
	}

	updateUserInfo(updates: {
		size?: string;
		condition?: string;
		material?: string;
		gender?: string;
		brand?: string;
		measurements?: any;
		originalPrice?: number;
	}): void {
		if (updates.size !== undefined) this.size = updates.size;
		if (updates.condition !== undefined) this.condition = updates.condition;
		if (updates.material !== undefined) this.material = updates.material;
		if (updates.gender !== undefined) this.gender = updates.gender;
		if (updates.brand !== undefined) this.brand = updates.brand;
		if (updates.measurements !== undefined) this.measurements = updates.measurements;
		if (updates.originalPrice !== undefined) this.originalPrice = updates.originalPrice;
	}

	updateAIGeneratedInfo(updates: {
		title?: string;
		description?: string;
		tags?: string[];
		category?: string;
		subcategory?: string;
		color?: string;
		price?: number;
	}): void {
		if (updates.title !== undefined) this.title = updates.title;
		if (updates.description !== undefined) this.description = updates.description;
		if (updates.tags !== undefined) this.tags = updates.tags;
		if (updates.category !== undefined) this.category = updates.category;
		if (updates.subcategory !== undefined) this.subcategory = updates.subcategory;
		if (updates.color !== undefined) this.color = updates.color;
		if (updates.price !== undefined) this.price = updates.price;
	}

	addImageKey(imageKey: string): void {
		if (!this.imageKeys.includes(imageKey)) {
			this.imageKeys.push(imageKey);
		}
	}

	removeImageKey(imageKey: string): void {
		this.imageKeys = this.imageKeys.filter(key => key !== imageKey);
	}

	addTag(tag: string): void {
		if (!this.tags.includes(tag)) {
			this.tags.push(tag);
		}
	}

	removeTag(tag: string): void {
		this.tags = this.tags.filter(t => t !== tag);
	}

	get isDraft(): boolean {
		return this.status === ListingStatus.DRAFT;
	}

	get isReady(): boolean {
		return this.status === ListingStatus.READY;
	}

	get isPublished(): boolean {
		return this.status === ListingStatus.PUBLISHED;
	}

	get isArchived(): boolean {
		return this.status === ListingStatus.ARCHIVED;
	}

	get hasRequiredInfo(): boolean {
		return !!(this.title && this.description && this.price && this.imageKeys.length > 0);
	}

	get discountPercentage(): number | null {
		if (!this.originalPrice || !this.price) return null;
		return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
	}
}