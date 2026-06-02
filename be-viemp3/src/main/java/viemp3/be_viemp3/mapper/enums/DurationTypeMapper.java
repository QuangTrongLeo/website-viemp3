package viemp3.be_viemp3.mapper.enums;

import viemp3.be_viemp3.dto.response.finance.DurationTypeResponse;
import viemp3.be_viemp3.enums.DurationType;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class DurationTypeMapper {

    public static DurationTypeResponse toResponse(DurationType duration) {
        if (duration == null) {
            return null;
        }

        return DurationTypeResponse.builder()
                .value(duration.name())
                .build();
    }

    public static List<DurationTypeResponse> toResponseList() {
        return Arrays.stream(DurationType.values())
                .map(DurationTypeMapper::toResponse)
                .collect(Collectors.toList());
    }
}
