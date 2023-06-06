import React, { useEffect, useState } from 'react';
import '../App.css';
import dotenv from 'dotenv';
dotenv.config();


function UserDetails() {
  const [fullUrl, setFullUrl] = useState('');
  const [shortUrls, setShortUrls] = useState([]);
  const [userData, setUserData] = useState('');

  useEffect(() => {
    fetchShortUrls();
    fetchUserData();
  }, []);

  const fetchShortUrls = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/shortUrls`);
      const data = await response.json();
      setShortUrls(data);
    } catch (error) {
      console.error('Failed to fetch short URLs:', error);
    }
  };

  const handleInputChange = (event) => {
    setFullUrl(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/shortUrls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullUrl }),
      });
      setFullUrl('');
      fetchShortUrls();
    } catch (error) {
      console.error('Failed to shrink URL:', error);
    }
  };

  const handleClick = async (shortUrl) => {
    
    console.log('handleClick called');

    try {
      const shortUrlId = shortUrl._id;
      const newTab = window.open(shortUrl.full, '_blank');
      if (newTab) {
        incrementClickCount(shortUrlId); // Increment the click count before opening the new tab
        newTab.onload = () => {
          console.log('New tab loaded');
        };
        newTab.onbeforeunload = () => {
          console.log('New tab closed');
          // Handle the tab being closed by the user
        };
      } else {
        console.error('Failed to open new tab.');
      }
    } catch (error) {
      console.error('Failed to navigate to URL:', error);
    }

  };
  const handleLinkClick = (event, shortUrl) => {
    event.stopPropagation(); // Prevent event bubbling
    handleClick(shortUrl);
  };


  const incrementClickCount = async (shortUrlId) => {
    console.log('Incrementing click count for:', shortUrlId);

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/shortUrls/${shortUrlId}/increment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Click count incremented successfully');
    } catch (error) {
      console.error('Failed to increment click count:', error);
    }
  };

  const resetShortUrls = async () => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/shortUrls`, {
        method: 'DELETE',
      });
      setShortUrls([]);
    } catch (error) {
      console.error('Failed to reset short URLs:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/userData`, {
        method: 'POST',
        crossDomain: true,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          token: window.localStorage.getItem('token'),
        }),
      });
      const data = await response.json();
      console.log(data, 'userData');
      setUserData(data.data);
      if (data.data === 'token expired') {
        alert('Token expired');
        window.localStorage.clear();
        window.location.href = './sign-in';
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const logout = () => {
    window.localStorage.clear();
    window.location.href = './sign-in';
  };

  return (
    <div className="container">
      <div className="header">
        <h1>URL Shrinker</h1>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>
      <form className="my-4 form-inline" onSubmit={handleSubmit}>
        <label htmlFor="fullURL" className="sr-only">
          URL
        </label>
        <input
          required
          type="url"
          placeholder="Enter URL"
          name="fullUrl"
          id="fullURL"
          className="form-control col mr-2"
          value={fullUrl}
          onChange={handleInputChange}
        />
        <button className="btn btn-success" type="submit">
          Shrink
        </button>
      </form>
      <table className="table table-striped table-responsive">
        <thead>
          <tr>
            <th>Full URL</th>
            <th>Short URL</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody>
          {shortUrls.map((shortUrl) => (
            <tr key={shortUrl._id}>
              <td>
                <a href={shortUrl.full}>{shortUrl.full}</a>
              </td>
              <td>
              <a href={"/userDetails"} onClick={(event) => handleLinkClick(event, shortUrl)}>
  {shortUrl.short}
</a>
              </td>
              <td>{shortUrl.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-danger" onClick={resetShortUrls}>
        Reset All
      </button>
    </div>
  );
}

export default UserDetails;
