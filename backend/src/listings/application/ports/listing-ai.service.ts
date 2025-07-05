export interface ListingContentInput {
	imageKeys: string[];
	category: string;
	brand: string;
	size: string;
	condition: string;
	// Optional context
	title?: string;
	description?: string;
	subcategory?: string;
	material?: string;
	gender?: string;
	color?: string;
	price?: number;
	originalPrice?: number;
	tags?: string[];
}

export interface ListingContentSuggestion {
	title: string;
	description: string;
	subcategory?: string;
	material?: string;
	gender?: string;
	color?: string;
	suggestedPrice?: number;
	tags: string[];
	vibeTags?: string[];
	confidence: number;
	insights?: string;
}

export interface ListingAIService {
	suggestContent(input: ListingContentInput): Promise<ListingContentSuggestion>;
}