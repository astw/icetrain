'use strict';

describe('Service: authenInterceptor', function () {

  // load the service's module
  beforeEach(module('psJwtApp'));

  // instantiate service
  var authenInterceptor;
  beforeEach(inject(function (_authenInterceptor_) {
    authenInterceptor = _authenInterceptor_;
  }));

  it('should do something', function () {
    expect(!!authenInterceptor).toBe(true);
  });

});
