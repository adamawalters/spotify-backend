import { Song, TrackResponse } from "./types";
import TokenManager from "./TokenManager";

export function removeSongDuplicates(tracks: Song[]) {

    const uniqueStandardizedNames = new Set<string>();
    const uniqueIsrcs = new Set<string>();

    const deduplicatedTracks = tracks.filter((song => {
      const additionalInfoRegex = /(?:\([^)]*\)|-).*$/;
      const standardizedSongName = song.name
        .replace(additionalInfoRegex, "")
        .trim()
        .toLowerCase();

      if(uniqueStandardizedNames.has(standardizedSongName)) {
        return false;
      } else {
        uniqueStandardizedNames.add(standardizedSongName)
      }

      if(uniqueIsrcs.has(song.external_ids.isrc)) {
        return false;
      } else {
        uniqueIsrcs.add(song.external_ids.isrc)
      }

      // If the song is not present already in either the standardized name or isrc filters, it's unique - add to filtered list
      return true;

    }))

    deduplicatedTracks.sort((a, b) =>
      a.name.localeCompare(b.name)
  );

    return deduplicatedTracks;
}

// Fetches all songs from a paginated response
export async function fetchAllSongs(trackResponse: TrackResponse) {

  const tokenManager = TokenManager.getInstance();
  const token = await tokenManager.getToken();

  while (trackResponse.next) {
    const currResponse = await fetch(trackResponse.next, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    const currParsedResponse = await currResponse.json();
    const currTrackResponse: TrackResponse = currParsedResponse.tracks;

    trackResponse.items.push(...currTrackResponse.items);
    trackResponse.next = currTrackResponse.next;
  }

    return trackResponse;
}