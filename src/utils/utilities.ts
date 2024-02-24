import { TrackResponse, Song } from "./types";

export function removeSongDuplicates(trackResponse: TrackResponse) {

    const originalTracks: Song[] = trackResponse.items;
    const isrcFilteredTracks: Song[] = [];
    const nameFilteredTracks: Song[] = [];
    const isrc_ids = new Set();
    const song_names = new Set();

    /*Filter based on isrc */
    originalTracks.forEach((track) => {
      if (!isrc_ids.has(track.external_ids.isrc)) {
        isrc_ids.add(track.external_ids.isrc);
        isrcFilteredTracks.push(track);
      }
    });

    /*Filter based on exact name match */
    isrcFilteredTracks.forEach((track) => {
      const additionalInfoRegex = /(?:\([^)]*\)|-).*$/;
      const standardizedTrackName = track.name
        .replace(additionalInfoRegex, "")
        .trim()
        .toLowerCase();

      if (!song_names.has(standardizedTrackName)) {
        song_names.add(standardizedTrackName);
        nameFilteredTracks.push(track);
      }
    });

    nameFilteredTracks.sort((a, b) =>
      a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    );
    
    return nameFilteredTracks    
}