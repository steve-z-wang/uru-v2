export enum ListingStatus {
	DRAFT = 'DRAFT',
	READY = 'READY',
	PUBLISHED = 'PUBLISHED',
	ARCHIVED = 'ARCHIVED',
}

export enum ListingCondition {
	NEW = 'NEW',
	LIKE_NEW = 'LIKE_NEW',
	GOOD = 'GOOD',
	FAIR = 'FAIR',
	POOR = 'POOR',
}

export interface ListingProps {
	// Core fields
	id?: string;
	status: ListingStatus;
	imageKeys: string[];
	userId: string;

	// Basic info
	title?: string;
	description?: string;
	category?: string;
	subcategory?: string;

	// Physical attributes
	size?: string;
	condition?: ListingCondition;
	material?: string;
	gender?: string;
	brand?: string;
	color?: string;

	// Pricing
	price?: number;
	originalPrice?: number;

	// Metadata
	tags?: string[];

	// Timestamps
	createdAt?: Date;
	updatedAt?: Date;
}

export class Listing {
	private props: ListingProps;

	constructor(data: ListingProps) {
		this.props = data;
	}

	getProps(): Readonly<ListingProps> {
		return {
			...this.props,
		};
	}

	markReady(): void {
		if (this.props.status !== ListingStatus.DRAFT) {
			throw new Error('Only draft listings can be marked ready');
		}
		this.props.status = ListingStatus.READY;
	}

	publish(): void {
		if (this.props.status !== ListingStatus.READY) {
			throw new Error('Only ready listings can be published');
		}
		this.props.status = ListingStatus.PUBLISHED;
	}

	archive(): void {
		if (this.props.status !== ListingStatus.PUBLISHED) {
			throw new Error('Only published listings can be archived');
		}
		this.props.status = ListingStatus.ARCHIVED;
	}
}
