package gr.cleavest.webfluxfilmsdb.mapper;

import gr.cleavest.webfluxfilmsdb.dto.FilmDTO;
import gr.cleavest.webfluxfilmsdb.entity.FilmEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

/**
 * @author Cleavest on 20/10/2024
 */
@Mapper(componentModel = "spring")
public interface FilmMapper {

    FilmDTO map(FilmEntity filmEntity);

    @InheritInverseConfiguration
    FilmEntity map(FilmDTO filmDTO);
}
