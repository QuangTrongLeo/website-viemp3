package viemp3.be_viemp3.enums;

import lombok.Getter;

@Getter
public enum GenreEnum {
    BALLAD("Nhạc Ballad"),
    POP("Nhạc Pop Việt"),
    RNB("R&B Việt"),
    RAP("Rap"),
    HIPHOP("Hip Hop Việt"),
    DANCE("Nhạc Dance Việt"),
    REMIX("Nhạc Remix Việt"),
    LOFI("Nhạc Lofi Chill"),
    ACOUSTIC("Nhạc Acoustic Việt"),
    INDIE("Indie Việt");
    private final String description;
    GenreEnum(String description) {
        this.description = description;
    }
}
