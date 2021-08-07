import { IModel, IFilterRole } from 'interfaces';
import { FIELD_TYPE } from './constants';

export default class DynamicFilterAbstructor {
  /**
   * Extract relation table name from relation.
   * @param {String} column -
   * @return {String} - join relation table.
   */
  protected getTableFromRelationColumn = (column: string) => {
    const splitedColumn = column.split('.');
    return splitedColumn.length > 0 ? splitedColumn[0] : '';
  };

  /**
   * Builds view roles join queries.
   * @param {String} tableName - Table name.
   * @param {Array} roles - Roles.
   */
  protected buildFilterRolesJoins = (builder) => {
    this.dynamicFilters.forEach((dynamicFilter) => {
      const relationsFields = dynamicFilter.relationFields;

      this.buildFieldsJoinQueries(builder, relationsFields);
    });
  };

  private buildFieldsJoinQueries = (builder, fieldsRelations: string[]) => {
    fieldsRelations.forEach((fieldRelation) => {
      const relation = this.model.relationMappings[fieldRelation];

      if (relation) {
        const splitToRelation = relation.join.to.split('.');
        const relationTable = splitToRelation[0] || '';

        builder.join(relationTable, relation.join.from, '=', relation.join.to);
      }
    });
  };

  getModel() {
    return this.model;
  }
}