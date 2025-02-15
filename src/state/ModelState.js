// For all models other than NN

import React from "react";
import { useReducer, createContext, useContext } from "react";

import { ModelActionType, ModelActions } from "state/ModelActions";
import { MapRounded } from "@material-ui/icons";
import { addResponseMessage } from "react-chat-widget";

const InitialState = () => ({
  knn_k: 5,
  knn_labels: [], // string labels
  knn_result_labels: [], // label indexes
  knn_expected_labels: [],
  knn_test_data: [],
  knn_columns: [],
  knn_columns_map: {},
  knn_column_units: [],
  knn_column1_index: 2,
  knn_column2_index: 1,

  linreg_test_result: [],
  linreg_test_set: [],
  linreg_x_name: "",
  linreg_y_name: "",
  linreg_columns: [],

  nlp_datas: [],

  viz_loading: false,
});

const initialState = InitialState();
const ModelStateContext = createContext(initialState);
const DispatchModelStateContext = createContext(() => null);

function reducer(state, action: ModelActionType) {
  switch (action.type) {
    case ModelActions.SET_KNN_K:
      return {
        ...state,
        knn_k: action.k,
      };
    case ModelActions.SET_KNN_COLS:
      return {
        ...state,
        knn_column1_index: action.indices[0],
        knn_column2_index: action.indices[1],
      };
    case ModelActions.KNN_DONE:
      const metrics = action.knn_accuracy;
      addResponseMessage(
        `KNN run (70-30 train-test split) \n &#8226; K = ${
          state.knn_k
        } \n &#8226; Train set ${metrics[0]}, Test set ${
          metrics[1]
        } \n &#8226; Accuracy: ${(1 - metrics[2] / metrics[1]).toFixed(2)} (${
          metrics[2]
        }/${metrics[1]} misclassified)`
      );
      return {
        ...state,
        viz_loading: false,
        knn_result_labels: action.knn_result_labels,
        knn_expected_labels: action.knn_expected_labels,
        knn_test_data: action.knn_test_data,
        knn_columns: action.knn_columns,
        knn_columns_map: action.knn_columns_map,
        knn_column_units: action.knn_column_units,
        knn_labels: action.knn_labels,
      };
    case ModelActions.LINREG_SET_IND_VAR:
      return {
        ...state,
        linreg_x_name: action.linreg_x_name,
      };
    case ModelActions.LINREG_DONE:
      const newState = {
        ...state,
        viz_loading: false,
        linreg_test_result: action.linreg_test_result,
        linreg_test_set: action.linreg_test_set,
        linreg_columns: action.linreg_columns,
      };
      if (action.linreg_x_name) {
        newState["linreg_x_name"] = action.linreg_x_name;
        newState["linreg_y_name"] = action.linreg_y_name;
      }
      addResponseMessage(
        `Linear Regression run (70-30 train-test split) \n &#8226; Independent variable ${
          action.linreg_y_name ?? state.linreg_y_name
        } \n &#8226; Dependent variable ${
          action.linreg_x_name ?? state.linreg_x_name
        }` + `\n &#8226; R2 value: ${action.linreg_r2}`
      );
      return newState;
    case ModelActions.NLP_DONE:
      if (action.results[0] > 0) {
        addResponseMessage(
          `NLP Models Run \n &#8226; Total queries to wit: ${action.results[1]} \n &#8226; Correctly classified sentiment: ${action.results[0]}`
        );
      }
      return {
        ...state,
        viz_loading: false,
        nlp_datas: action.datas,
      };
    case ModelActions.RUNNING:
      return { ...state, viz_loading: true };
    default:
      return state;
  }
}

export const ModelStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ModelStateContext.Provider value={state}>
      <DispatchModelStateContext.Provider value={dispatch}>
        {children}
      </DispatchModelStateContext.Provider>
    </ModelStateContext.Provider>
  );
};

export const useModelState = () => ({
  model_state: useContext(ModelStateContext),
  model_dispatch: useContext(DispatchModelStateContext),
});
