const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('Generate and fetch rewards', () => {
  it('should generate rewards for a user', (done) => {
    chai
      .request(app)
      .get('/users/1/rewards?at=2023-11-02T00:00:00Z')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.be.a('array');
        res.body.data.length.should.be.eql(7);
        done();
      });
  });
});
