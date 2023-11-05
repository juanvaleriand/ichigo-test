const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('Redeem rewards', () => {
  it('should redeem a reward if not expired', (done) => {
    chai
      .request(app)
      .patch('/users/1/rewards/2023-11-03T00:00:00Z/redeem')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('redeemedAt');
        done();
      });
  });

  it('should return an error if trying to redeem an expired reward', (done) => {
    chai
      .request(app)
      .patch('/users/1/rewards/2023-11-02T00:00:00Z/redeem')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('message').eql('This reward is already expired');
        done();
      });
  });
});
