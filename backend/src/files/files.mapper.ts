import { File } from './files.model';
import { FileDto } from './dto/output/file.dto';

export class FilesMapper {
	static toDto(file: File): FileDto {
		return {
			id: file.id,
		};
	}
}
