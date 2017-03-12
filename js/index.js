"use strict";

var Panel = ReactBootstrap.Panel,
    Accordion = ReactBootstrap.Accordion;
var Button = ReactBootstrap.Button,
    Input = ReactBootstrap.Input;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Modal = ReactBootstrap.Modal;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var ListGroup = ReactBootstrap.ListGroup,
    ListGroupItem = ReactBootstrap.ListGroupItem;

var movies = typeof localStorage["movieDB"] != "undefined" ? JSON.parse(localStorage["movieDB"]) : [{ title: "Kill Bill", actors: ["Uma Thurman", "David Carradine", "Daryl Hannah", "Lucy Liu", "Michael Madsen"] }, { title: "Get Out", actors: ["Daniel Kaluuya", "Allison Williams", "Bradley Whitford"] }, { title: "Split", actors: ["James McAvoy", "Bett Buckley", "Anya Taylor-Joy"] }],
    globalTitle = "",
    globalActors = [];

var MovieDB = React.createClass({
  displayName: "MovieDB",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Accordion,
        null,
        this.props.data
      )
    );
  }
});

// Movie class. This is the display for a movie in movieDB
var Movie = React.createClass({
  displayName: "Movie",

  remove: function remove() {
    movies.splice(this.props.index, 1);
    update();
  },
  edit: function edit() {
    globalTitle = this.props.title;
    globalActors = this.props.actors;
    document.getElementById("show").click();
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h4",
        { className: "text-center" },
        "Actors"
      ),
      React.createElement("hr", null),
      React.createElement(ActorList, { actors: this.props.actors }),
      React.createElement(
        ButtonToolbar,
        null,
        React.createElement(
          Button,
          { "class": "delete", bsStyle: "danger", id: "btn-del" + this.props.index, onClick: this.remove },
          "Delete"
        ),
        React.createElement(
          Button,
          { bsStyle: "default", id: "btn-edit" + this.props.index, onClick: this.edit },
          "Edit"
        )
      )
    );
  }
});

// ActorList class. This lists all actors for a Movie
var ActorList = React.createClass({
  displayName: "ActorList",

  render: function render() {
    var actorList = this.props.actors.map(function (actor) {
      return React.createElement(
        ListGroupItem,
        null,
        actor
      );
    });
    return React.createElement(
      ListGroup,
      null,
      actorList
    );
  }
});

// MovieAdd class. This contains the Modal and Add Movie button
var MovieAdd = React.createClass({
  displayName: "MovieAdd",

  getInitialState: function getInitialState() {
    return { showModal: false };
  },
  close: function close() {
    globalTitle = "";
    globalActors = [];
    this.setState({ showModal: false });
  },
  open: function open() {
    this.setState({ showModal: true });
    if (document.getElementById("title") && document.getElementById("actors")) {
      $("#title").val(globalTitle);
      $("#actors").val(globalActors);
      if (globalTitle != "") {
        $("#modalTitle").text("Edit Movie");
        $("#addButton").text("Edit Movie");
      }
    } else requestAnimationFrame(this.open);
  },
  add: function add() {
    var title = document.getElementById("title").value;
    var actors = document.getElementById("actors").value.split(",");
    var exists = false;
    for (var i = 0; i < movies.length; i++) {
      if (movies[i].title === title) {
        movies[i].actors = actors;
        exists = true;
        break;
      }
    }
    if (!exists) {
      if (title.length < 1) title = "Untitled";
      movies.push({ title: title, actors: document.getElementById("actors").value.split(",") });
    }
    update();
    this.close();
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Button,
        {
          bsStyle: "primary",
          bsSize: "large",
          onClick: this.open,
          id: "show"
        },
        "Add Movie"
      ),
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.close },
        React.createElement(
          Modal.Header,
          { closeButton: true },
          React.createElement(
            Modal.Title,
            { id: "modalTitle" },
            "Add a Movie"
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(
            "form",
            null,
            React.createElement(Input, { type: "text", label: "Movie", placeholder: "Movie Name", id: "title" }),
            React.createElement(Input, { type: "textarea", label: "Actors", placeholder: "Enter Actors Separated By Commas", id: "actors" })
          )
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { onClick: this.add, bsStyle: "primary", id: "addButton" },
            "Add Movie"
          ),
          React.createElement(
            Button,
            { onClick: this.close },
            "Close"
          )
        )
      )
    );
  }
});

// Update function to display all the movies
function update() {
  localStorage.setItem("movieDB", JSON.stringify(movies));
  var rows = [];
  for (var i = 0; i < movies.length; i++) {
    rows.push(React.createElement(
      Panel,
      { header: movies[i].title, eventKey: i, bsStyle: "success" },
      React.createElement(Movie, { title: movies[i].title, actors: movies[i].actors, index: i })
    ));
  }
  ReactDOM.render(React.createElement(MovieDB, { data: rows }), document.getElementById("container"));
}

ReactDOM.render(React.createElement(MovieAdd, null), document.getElementById("button"));
update(); // Initially render the movie db
