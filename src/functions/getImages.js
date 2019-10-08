import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'api-version': '1.0',
  'x-api-key': 'eRyFkruJWy3cgIpWRSBpL5wGLiG9EjmZ4YqdVvIk',
  'X-Incode-Hardware-Id':
    'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJXRUJfQVBQX0FETUlOI92iwicm9sZSI6IkFETUlOIiwiZXhwIjoxNTc3NjM5MDYxLCJpYXQiOjE1Njk4NTk0NjF9.DKD1S8MbhZ_dmbVOFCzWwfWz4ngJDvBJgL9h6n3Oe7I54'
};

function getImages(uuid) {
  return axios
    .get(
      `https://photoshare-stage-api.incodesmile.com/photoshare/photos/get?uuid=${uuid}`,
      { headers }
    )
    .then(response => {
      response.data.photos.forEach((element, index) => {
        element.index = index;
        element.selected = false;
        element.photo = element.resizedPhotoUrl;
      });
      return response.data.photos;
    });
}

export default getImages;
