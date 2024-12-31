package gr.cleavest.webfluxfilmsdb.mapper;

import gr.cleavest.webfluxfilmsdb.dto.WatchListDTO;
import gr.cleavest.webfluxfilmsdb.entity.WatchListEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;

/**
 * @author Cleavest on 20/11/2024
 */
@Mapper(componentModel = "spring")
public interface WatchListMapper {

    WatchListDTO map(WatchListEntity entity);

    @InheritInverseConfiguration
    WatchListEntity map(WatchListDTO dto);
}
