export class User {
	constructor(
		public readonly id: string,
		public readonly email: string,
		public readonly firstName: string | null,
		public readonly lastName: string | null,
	) {}
}
