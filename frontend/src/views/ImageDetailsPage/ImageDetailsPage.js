import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useHistory } from 'react-router-dom';

import { getImageDetailsFromAPI } from 'API';
import { Button, Loader, Wrapper } from 'assets/styles/style';
import Footer from 'components/Footer/Footer';
import Header from 'components/Header/Header';
import ImageDetails from 'views/ImageDetailsPage/components/ImageDetails/ImageDetails';
import ImageDetailsArea from 'views/ImageDetailsPage/components/ImageDetailsArea/ImageDetailsArea';

const ImageDetailsPage = () => {
  const { id } = useParams();
  const [imageDetails, setImageDetails] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const callAPI = async () => {
      if (imageDetails && !imageDetails.content) {
        setIsImageLoading(true);
      }

      try {
        const imgDetails = await getImageDetailsFromAPI(id);
        setImageDetails(imgDetails);
        if (!imgDetails.gcp) {
          setTimeout(callAPI, 2500);
          setIsDescriptionLoading(true);
        } else {
          setIsDescriptionLoading(false);
        }
      } catch (err) {
        history.push('/error');
        console.error(err);
      } finally {
        setIsImageLoading(false);
        setIsDescriptionLoading(false);
      }
    };
    callAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Wrapper>
        <Header />
        {isImageLoading && <Loader />}
        {!isImageLoading && <ImageDetailsArea content={imageDetails.content} />}
        <br />
        {isDescriptionLoading && <h2>Image details are being analyzed.</h2>}
        {!isDescriptionLoading && <ImageDetails gcp={imageDetails.gcp} />}
        <Link to="/">
          <Button>Home Page</Button>
        </Link>
      </Wrapper>
      <Footer />
    </>
  );
};

export default ImageDetailsPage;
