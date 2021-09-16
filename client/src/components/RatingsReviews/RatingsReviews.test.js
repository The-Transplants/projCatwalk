import React from 'react';
import { RatingsReviews } from './RatingsReviews';
import { ReviewsList } from './ReviewsList';
import { RatingsBreakdown } from './RatingsBreakdown';

import {reviewsList} from '../../dummyData/reviewsList.js';

import {render, screen, fireEvent} from '@testing-library/react';
import { TestWatcher } from '@jest/core';



describe('Ratings and Reviews rendering', () => {

  beforeEach(() => {
    render( <RatingsReviews testing={true} /> )
  });
  

  it('renders the RatingsReviews parent component', () => {
    let element = document.querySelector('#RatingsReviews');
    expect(element).toBeTruthy();
  });

  it('renders a ReviewList component', () => {
    let element = document.querySelector('#ReviewsList');
    expect(element).toBeTruthy();
  });

  
  it('renders a Review component', () => {
    let element = document.querySelector('#Review');
    expect(element).toBeTruthy();
  });
});

describe('Review component', () => {
  beforeEach(() => {
    render( <ReviewsList reviewslist={reviewsList} filter={{}} setFilter={() => {}}/> )
  });

  it('Test for star rating', () => {
    expect( screen.queryAllByTestId(/starmeter/)).toHaveLength(2);
  });

  it('Test for summary', () => {
    expect( screen.queryByText(/I'm enjoying wearing these shades/) ).toBeTruthy();
  });

  it('Test for date', () => {
    expect( screen.queryByText(/2019-04-14T00:00:00.000Z/) ).toBeTruthy();
  });

  it('Test for reviewer_name', () => {
    expect( screen.queryByText(/shortandsweeet/) ).toBeTruthy();
  });

  it('Test for body', () => {
    expect( screen.queryByText(/Sonic X-treme was a platform game/) ).toBeTruthy();
  });

  it('body should not show the dummy text beyond 1000 characters', () => {
    expect( screen.queryByText(/X-treme appeared in later games, such as Sonic Lost World/) ).toBeFalsy();
  });

  it('Test for recommend', () => {
    expect( screen.queryAllByText(/Recommend: False/) ).toHaveLength(2);
  });

  it('Test for response', () => {
    expect( screen.queryByText(/Some sort of response/) ).toBeTruthy();
  });

  it('Test for helpfulness', () => {
    expect( screen.queryAllByText(/Helpfulness: \d/) ).toHaveLength(2);
  });

  it('should not show beyond 250 characters in the body, initially', () => {
    expect( screen.queryByText(/magic rings from Tiara/) ).toBeFalsy();
  });

  it('should show the Show More button when review is over 250 characters', () => {
    expect( screen.queryByText(/Show More/) ).toBeTruthy();
    expect( screen.queryAllByText(/Show More/) ).toHaveLength(1);
  });

  it('should show the full review text when Show More is clicked', () => {
    fireEvent(
      screen.queryByText(/Show More/),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    expect( screen.queryByText(/magic rings from Tiara/) ).toBeTruthy();
  });
});

describe('ReviewsList component', () => {
  beforeEach(() => {
    render( <ReviewsList reviewslist={reviewsList} filter={{}} setFilter={() => {}} /> )
  });

  it('should render two Review components (according to dummy data)', () => {
    expect( screen.queryAllByTestId('Review') ).toHaveLength(2);
  });
});

describe('RatingsBreakdown component', () => {
  beforeEach(() => {
    render( <RatingsBreakdown filter={{}} />);
  });

  it('Overall average review score is rendered', () => {
    expect( screen.queryByText(/Score: 3.6/) ).toBeTruthy();
  });

  it('StarRating component is rendered', () => {
    expect( screen.queryByTestId(/starrating/) ).toBeTruthy();
    expect( screen.queryByTestId(/starmeter/) ).toBeTruthy();
  });
  
  it('"Percentage of reviews that recommend" is rendered', () => {
    expect( screen.queryByText(/% of reviews recommended/) ).toBeTruthy();
  });

  it('"5-4-3-2-1" star breakdown is rendered', () => {
    expect( screen.queryByText(/^5 stars$/) ).toBeTruthy();
    expect( screen.queryByText(/^4 stars$/) ).toBeTruthy();
    expect( screen.queryByText(/^3 stars$/) ).toBeTruthy();
    expect( screen.queryByText(/^2 stars$/) ).toBeTruthy();
    expect( screen.queryByText(/^1 stars$/) ).toBeTruthy();
    expect( screen.queryAllByTestId(/starcountmeter/) ).toHaveLength(5);
  });

  it('Average size rating is rendered', () => {
    expect( screen.queryByTestId(/sizemeter/) ).toBeTruthy();
  });

  it('Average comfort rating is rendered', () => {
    expect( screen.queryByTestId(/comfortmeter/) ).toBeTruthy();
  });

});

describe('Filtering reviews', () => {
  beforeEach(() => {
    render( <RatingsReviews testing={true} /> );
  });

  it('should only show 4 star reviews when the 4 star label is clicked', () => {
    fireEvent(
      screen.queryByText(/^4 stars$/),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect( screen.queryByText(/Sonic X-treme was a platform game/) ).toBeFalsy();
    expect( screen.queryByText(/They are very dark. But that's good/) ).toBeTruthy();
  });

  it('should only show 3 star reviews when the 3 star label is clicked', () => {
    fireEvent(
      screen.queryByText(/^3 stars$/),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect( screen.queryByText(/They are very dark. But that's good/) ).toBeFalsy();
    expect( screen.queryByText(/Sonic X-treme was a platform game/) ).toBeTruthy();
  });

  it('should restore 3 star reviews when the 3 star label is clicked a second time', () => {
    fireEvent(
      screen.queryByText(/^3 stars$/),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect( screen.queryByText(/They are very dark. But that's good/) ).toBeFalsy();
    expect( screen.queryByText(/Sonic X-treme was a platform game/) ).toBeTruthy();

    fireEvent(
      screen.queryByText(/^3 stars$/),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect( screen.queryByText(/They are very dark. But that's good/) ).toBeTruthy();
    expect( screen.queryByText(/Sonic X-treme was a platform game/) ).toBeTruthy();
  });

  it('should clear all filters when the Clear Filter button is clicked', () => {
    fireEvent(
      screen.queryByText(/^3 stars$/),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect( screen.queryByText(/They are very dark. But that's good/) ).toBeFalsy();
    expect( screen.queryByText(/Sonic X-treme was a platform game/) ).toBeTruthy();

    fireEvent(
      screen.queryByText(/^Clear filters$/),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect( screen.queryByText(/They are very dark. But that's good/) ).toBeTruthy();
    expect( screen.queryByText(/Sonic X-treme was a platform game/) ).toBeTruthy();
  });

  it('"Clear filters" button should appear only when filters are applied', () => {
    expect( screen.queryByText(/Clear filters/) ).toBeFalsy();
    
    fireEvent(
      screen.queryByText(/^3 stars$/),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect( screen.queryByText(/Clear filters/) ).toBeTruthy();

    fireEvent(
      screen.queryByText(/^Clear filters$/),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect( screen.queryByText(/Clear filters/) ).toBeFalsy();
  });
});


/*  
The API itself has a 'sort' parameter that delivers the data in 
the desired way, so testing using the dummy data - which remains in the same order -
is tricky.

Should I mock the getProductReviews()?
How do I make the component use the mock without modifying the component directly?

Or perhaps just copy/paste the dummy data in different orders manually,
and expand on the RatingsReviews component's behavior when props.testing=true?
It seems like a poor idea to implement a lot of test-specific functionality in the component.

Or is there a way to test that changing the sort option fires getProductReviews() - 
after all, getProductReviews() is already tested separately in the serverRequests.test.js

Manual testing shows correct behavior as of September 16, 11:30 a.m.
*/
xdescribe('Sorting of Reviews: Correct as of 2021.09.16, 11:30 a.m.', () => {
  beforeEach( () => {
    render(<RatingsReviews testing={true} />);
  });

  it('should default to sorting reviews by "relevant"', () => {
    // default order is 'relevant'; so no need to change/click anything
    let element = screen.queryAllByTestId('reviewsummary');
    expect( element[0].innerHTML ).toMatch(/I'm enjoying wearing these shades/);
    expect( element[1].innerHTML ).toMatch(/I am liking these glasses/);
  });

  it('when "helpful" is selected, reviews are sorted from most to least helpful', () => {
    fireEvent.click( screen.queryByTestId('select') );
    let options = screen.queryAllByRole('option');
    fireEvent.click( options[2] ); // 'Helpful'

    let element = screen.queryAllByTestId('reviewsummary');
    expect( element[0].innerHTML ).toMatch(/I'm enjoying wearing these shades/);
    expect( element[1].innerHTML ).toMatch(/I am liking these glasses/);
  });

  it('when "newest" is selected, most recent review appears first', () => {
    fireEvent.click( screen.queryByTestId('select') );
    let options = screen.queryAllByRole('option');
    fireEvent.click( options[1] ); // 'Newest'

    let element = screen.queryAllByTestId('reviewsummary');
    expect( element[0].innerHTML ).toMatch(/I am liking these glasses/);
    expect( element[1].innerHTML ).toMatch(/I'm enjoying wearing these shades/);
  });
});