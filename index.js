// @flow
import React from "react";
import { connect } from "react-redux";
import { loadCentralMenus } from "../../actions/centralMenus";
import { withNamespaces } from "react-i18next";
import { Content } from "./components";
import { Bar, Line, Doughnut, Radar } from "react-chartjs-2";
import { loadRecipe } from "../../actions/recipe";
import axios from "axios";
import { loadRecipes, filterRecipes } from "~/actions/recipes";
import {faLeaf, faUtensils} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Table from './Table'

class Dashboard extends React.Component<Props, State> {
  state = {
    char: false,
    conditions: []
  };

  componentDidMount() {
    this.props.loadCentralMenus();
    this.props.loadRecipes();
    this.loadConditions();
  }

  groupBy(collection, property) {
    var i = 0,
      val,
      index,
      values = [],
      result = [];
    for (; i < collection.length; i++) {
      val = collection[i][property];
      index = values.indexOf(val);
      if (index > -1) result[index].push(collection[i]);
      else {
        values.push(val);
        result.push([collection[i]]);
      }
    }
    return result;
  }

  getCount(collection, property) {
    let i = 0;
    for (let j = 0; j < collection.length; j++) {
      if (collection[i][property]) i++;
    }
    return i;
  }

  groupByArray(xs, key) {
    return xs.reduce(function(rv, x) {
      let v = key instanceof Function ? key(x) : x[key];
      let el = rv.find(r => r && r.key === v);
      if (el) {
        el.values.push(x);
      } else {
        rv.push({
          key: v,
          values: [x]
        });
      }
      return rv;
    }, []);
  }

  group(array, property) {
    let dashArr = [];
    let ar = array.map(item => {
      return (
        item[property] &&
        item[property].length &&
        item[property].map((elem, key) => {
          return dashArr.push(elem);
        })
      );
    });
    return this.groupByArray(dashArr, "length");
  }

  getAverageCost(recipes) {
    let avCost = 0;
    for (let i = 0; i < recipes.length; i++) {
      avCost += recipes[i].cost;
    }
    return parseFloat(avCost / recipes.length).toFixed(2);
  }

  loadConditions = () => {
    axios({
      method: "GET",
      url:
        "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/stitchmatrix-mtxou/service/StitchGetService/incoming_webhook/getAllConditionsWebHook"
    }).then(res => {
      this.setState({ conditions: this.groupBy(res.data, "conditionType") });
    });
  };

  render() {
    let { centralMenus, recipes } = this.props;

    let { conditions } = this.state;

    let averageCost = this.getAverageCost(recipes);

    let dayPart = this.groupBy(centralMenus, "dayPart");
    let dayPartLabels = dayPart.map(item =>
      item[0].dayPart ? item[0].dayPart : "Other"
    );
    dayPart = dayPart.map(item => item && item.length);
    let conditionLabels = conditions.map(item =>
      item[0].conditionType ? item[0].conditionType : "Other"
    );
    conditions = conditions.map(item => item && item.length);
    let dishes = this.group(centralMenus, "selectedOptionsArr");
    let dishesLabels = dishes.map(item =>
      item.values[0] ? item.values[0] : "Other"
    );
    dishes = dishes.map(item => item.values.length);

    let organic = this.getCount(recipes, "isOrganic");
    let orphan = this.getCount(recipes, "isOrphan");
      console.log('centralMenuscentralMenuscentralMenus', centralMenus);

      return (
      <Content>
        <div className="container-fluid">
          <div className="card">
            <div className="card-body">
              <div className="row justify-content-around">
                <div className="col-md-2">
                  <div className="card-counter primary">
                      <div className='d-flex justify-content-between'>
                          <img src="https://cdn3.iconfinder.com/data/icons/pictofoundry-pro-vector-set/512/Leaf-512.png" alt="" width={40} style={{height: '42px'}}/>
                          <span className="count-numbers">{organic}</span>
                      </div>
                    <p className="count-name">Organic</p>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="card-counter danger">
                      <div className='d-flex justify-content-between'>
                          <img src="https://cdn1.iconfinder.com/data/icons/food-drink-2/32/fork-spoon-512.png" alt="" width={40} style={{height: '42px'}}/>
                          <span className="count-numbers">{orphan}</span>
                      </div>
                      <p className="count-name">Orphan</p>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="card-counter success">
                      <div className='d-flex justify-content-between'>
                          <img src="https://cdn4.iconfinder.com/data/icons/wine-2/512/18-512.png" alt="" width={30} style={{height: '42px'}}/>
                          <span className="count-numbers text-white">{this.props.centralMenus.length}</span>
                      </div>
                      <p className="count-name">Menus</p>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="card-counter info">
                      <div className='d-flex justify-content-between'>
                          <img src="https://cdn4.iconfinder.com/data/icons/content1-1/24/Cookbook-512.png" alt="" width={40} style={{height: '42px'}}/>
                          <span className="count-numbers text-white">{this.props.recipes.length}</span>
                      </div>
                    <p className="count-name">Recipes</p>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="card-counter bg-warning">
                      <div className='d-flex justify-content-between'>
                          <img src="https://cdn1.iconfinder.com/data/icons/business-report-1/40/report-07-512.png" alt="" width={40} style={{height: '42px'}}/>
                          <span className="count-numbers text-white">{averageCost}&euro;</span>
                      </div>



                    <p className="count-name align-content-md-center">Recipes Average Cost</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row pt-5">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <Doughnut
                    data={{
                      labels: conditionLabels,
                      datasets: [
                        {
                          label: "# of Conditions",
                          data: conditions,
                          backgroundColor: [
                            "rgba(255, 99, 132 )",
                            "rgba(54, 162, 235 )",
                            "rgba(255, 206, 86 )",
                            "rgba(75, 192, 192 )",
                            "rgba(153, 102,255)",
                            "rgba(255, 159, 64 )"
                          ],
                          borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)"
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <Bar
                    data={{
                      labels: dayPartLabels,
                      datasets: [
                        {
                          label: "# of Menus",
                          data: dayPart,
                          backgroundColor: [
                            "rgba(255, 99, 132)",
                            "rgba(54, 162, 235)",
                            "rgba(255, 206, 86)",
                            "rgba(75, 192, 192)",
                            "rgba(153, 102,255)",
                            "rgba(255, 159, 64)"
                          ],
                          borderColor: [
                            "rgba(255, 99, 132)",
                            "rgba(54, 162, 235)",
                            "rgba(255, 206, 86)",
                            "rgba(75, 192, 192)",
                            "rgba(153, 102,255)",
                            "rgba(255, 159, 64)"
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <Line
                    data={{
                      labels: dishesLabels,
                      datasets: [
                        {
                          label: "# of Dishes",
                          data: dishes,
                          backgroundColor: [
                            "rgba(255, 99, 132)",
                            "rgba(54, 162, 235)",
                            "rgba(255, 206, 86)",
                            "rgba(75, 192, 192)",
                            "rgba(153, 102,255)",
                            "rgba(255, 159, 64)"
                          ],
                          borderColor: [
                            "rgba(255, 99, 132)",
                            "rgba(54, 162, 235)",
                            "rgba(255, 206, 86)",
                            "rgba(75, 192, 192)",
                            "rgba(153, 102,255)",
                            "rgba(255, 159, 64)"
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <Radar
                    data={{
                      labels: dishesLabels,
                      datasets: [
                        {
                          label: "# of Dishes",
                          data: dishes,
                          backgroundColor: [
                            "rgba(255, 99, 132)",
                            "rgba(54, 162, 235)",
                            "rgba(255, 206, 86)",
                            "rgba(75, 192, 192)",
                            "rgba(153, 102,255)",
                            "rgba(255, 159, 64)"
                          ],
                          borderColor: [
                            "rgba(255, 99, 132)",
                            "rgba(54, 162, 235)",
                            "rgba(255, 206, 86)",
                            "rgba(75, 192, 192)",
                            "rgba(153, 102,255)",
                            "rgba(255, 159, 64)"
                          ],
                          borderWidth: 1
                        }
                      ]
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row pt-1">
            <div className="col-md-6 col-lg-6 col-12">
              <Table
                  data={centralMenus}
                  title={'Last Added Menus'}
              />
            </div>
            <div className="col-md-6 col-lg-6 col-12">
                <Table
                    data={centralMenus}
                    title={'Last Added Recipes'}
                />
            </div>
          </div>
          <div className="row pt-1">
            <div className="col-md-6 col-lg-6 col-12">
              <Table
                  data={centralMenus}
                  title={'Last Added Conditions'}
              />
            </div>
            <div className="col-md-6 col-lg-6 col-12">
              <Table
                  data={centralMenus}
                  title={'Last Added Articles'}
              />
            </div>
          </div>
        </div>
      </Content>
    );
  }
}

const mapStateToProps = state => ({
  centralMenus: state.centralMenus.available,
  isFetching: state.recipes.isFetching,
  recipes: state.recipes.filtered.filter(recipe => recipe.status === "510")
});

const mapDispatchToProps = {
  loadCentralMenus,
  loadRecipe,
  loadRecipes,
  filterRecipes
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces()(Dashboard));
