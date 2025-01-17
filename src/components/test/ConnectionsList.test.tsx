import ConnectionsList from "../ConnectionsList";
import { mount, shallow } from "enzyme";
import { forcePromiseResolve } from "../../test/testhelpers";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPreFabSocialGraph } from "../../test/testGraphs";
import { getPrefabProfile } from "../../test/testProfiles";
import { getPrefabFeed } from "../../test/testFeeds";

const profile = getPrefabProfile(0);
const graphs = getPreFabSocialGraph();
const feed = getPrefabFeed();
const store = createMockStore({
  user: { profile: profile },
  profiles: { profiles: [] },
  graphs: { graphs: graphs },
  feed: { feed: feed },
});

describe("ConnectionsList", () => {
  it("renders without crashing", async () => {
    const component = shallow(componentWithStore(ConnectionsList, store));
    await forcePromiseResolve();
    expect(() => component).not.toThrow();
  });

  describe("button displays correct list title", () => {
    it("displays correct list title on followers click", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await forcePromiseResolve();
      component.find(".ConnectionsList__button").first().simulate("click");
      expect(component.find("ConnectionsListProfiles").prop("listStatus")).toBe(
        0
      );
    });

    it("displays correct list title on following click", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await forcePromiseResolve();
      component.find(".ConnectionsList__button").last().simulate("click");
      expect(component.find("ConnectionsListProfiles").prop("listStatus")).toBe(
        2
      );
    });

    it("hides list on double click", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await forcePromiseResolve();
      component.find(".ConnectionsList__button").last().simulate("click");
      component.find(".ConnectionsList__button").last().simulate("click");
      expect(component.find("ConnectionsListProfiles").prop("listStatus")).toBe(
        0
      );
    });

    it("switches back and forth between lists", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await forcePromiseResolve();
      component.find(".ConnectionsList__button").first().simulate("click");
      component.find(".ConnectionsList__button").last().simulate("click");
      expect(component.find("ConnectionsListProfiles").prop("listStatus")).toBe(
        2
      );
    });
  });
});
