var ADMIN_SHEETS = (function() {
  var gridOptions = {};
  var selectedColId = null;
  var selectedRowIds = [];
  var changeSet = [];

  const getRequestParams = (method) => {
    return {
      method,
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value,
      })
    };
  };

  const buildRequest = (url, method='GET', data=null) => {
    let params = getRequestParams(method);

    if (data) {
      params.body = JSON.stringify(data);
    }

    return new Request(url, params);
  };

  var onSelectionChanged = function(event, other) {
    var col = event.api.focusedCellController.focusedCellPosition.column;
    var colId = col.colId;

    document.querySelectorAll('.selected-cell').forEach(function(cell) {
      cell.classList.remove('selected-cell');
    });

    var selector = '.ag-row-focus [col-id="' + colId +'"]';
    if (colId === selectedColId) {
      selector = '.ag-row-selected [col-id="' + colId +'"]';
    } else {
      selectedRowIds = [];
    }

    var cells = document.querySelectorAll(selector);

    cells.forEach(function(cell) {
      cell.classList.add('selected-cell');
      selectedRowIds.push(cell.parentNode.getAttribute('row-id'));
    });

    selectedColId = colId;
  };

  const onCellValueChanged = (event) => {
    const change = {
      id: event.data.id,
      [event.colDef.field]: event.value,
    };
    changeSet = changeSet.concat([change]);
  };

  var save = function(event) {
    var data = {};
    changeSet.forEach(function(change) {
      data[change.id] = Object.assign(data[change.id] || {}, change);
    });

    console.log(data);
    const path = '/sheets/journal/project/';
    const req = buildRequest(path, 'PUT', data);
    return fetch(req).then(res => res.json()).then((res) => console.log(res));
  };

  var attachListeners = function() {
    document.getElementById('editBtn').addEventListener('click', function() {
      if (!selectedColId) {
        return;
      }

      var value = prompt('Set new value for selected ' + selectedColId + ':');
      var updates = gridOptions.api.getSelectedNodes().map(function(node) {
        var data = node.data;
        data[selectedColId] = value;
        return data;
      });

      gridOptions.api.updateRowData({update: updates});
    });

    document.getElementById('saveBtn').addEventListener('click', save);
  };


  var init = function(columnDefs, rowData) {
    gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData,
      rowSelection: 'multiple',
      floatingFilter: true,
      onSelectionChanged: onSelectionChanged,
      onCellValueChanged: onCellValueChanged,
    };

    // let the grid know which columns and what data to use
    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#myGrid'); // create the grid passing in the div to use together with the columns & data we want to use
    new agGrid.Grid(eGridDiv, gridOptions);
    attachListeners();
  };

  return {
    init,
  };

})();
