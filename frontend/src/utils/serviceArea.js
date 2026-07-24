// Smart Grow currently only serves the Dambulla region. This checks whether
// a given coordinate falls within a service radius around Dambulla town.

const DAMBULLA_LAT = 7.8567
const DAMBULLA_LNG = 80.6517
const SERVICE_RADIUS_KM = 30 // covers Dambulla town + surrounding farming areas

export const SERVICE_AREA_NAME = 'Dambulla'

function toRad(deg) {
  return (deg * Math.PI) / 180
}

/**
 * Haversine distance between two lat/lng points, in kilometers.
 */
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Returns true if the given coordinates fall within Smart Grow's
 * current service area (Dambulla + surrounding radius).
 */
export function isWithinServiceArea(latitude, longitude) {
  return getDistanceKm(latitude, longitude, DAMBULLA_LAT, DAMBULLA_LNG) <= SERVICE_RADIUS_KM
}